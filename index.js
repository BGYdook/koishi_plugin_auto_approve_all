const { Context } = require('koishi')

exports.name = 'auto-approve-all'
exports.description = '自动同意所有好友申请与群邀请（OneBot）'

exports.apply = (ctx) => {
  const logger = ctx.logger('auto-approve-all')

  ctx.platform('onebot').on('friend-request', async (session) => {
    const flag = session.messageId
    const userId = session.userId
    try {
      await session.bot.handleFriendRequest(flag, true)
      let nickname = '未知用户'
      try {
        const info = await (session.onebot || session.bot.internal).getStrangerInfo(userId)
        nickname = info?.nickname || '未知用户'
      } catch (e) {}
      logger.info(`已自动同意好友申请: ${nickname}(${userId})`)
    } catch (e) {
      logger.error(`同意好友申请失败: ${e}`)
    }
  })

  ctx.platform('onebot').on('group-request', async (session) => {
    if (session.subtype !== 'invite') return
    const flag = session.messageId
    const userId = session.userId
    const groupId = session.groupId
    try {
      await session.bot.handleGroupRequest(flag, true)
      let groupName = '未知群聊'
      try {
        const info = await (session.onebot || session.bot.internal).getGroupInfo(groupId)
        groupName = info?.group_name || '未知群聊'
      } catch (e) {}
      logger.info(`已自动同意群邀请: ${groupName}(${groupId})，邀请人: ${userId}`)
    } catch (e) {
      logger.error(`同意群邀请失败: ${e}`)
    }
  })
}

