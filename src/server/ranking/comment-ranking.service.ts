export class CommentRankingService {
    constructor() {}

    // async onCommentCreated(parentId: string | null) {
    //     if (!parentId) return

    //     const parent = await this.commentRepository.incrementDirectReplyCount(parentId)

    //     const hotScore = calculateHotScore({
    //         upvotes: parent.upvotes,
    //         downvotes: parent.downvotes,
    //         replies: parent.directReplyCount,
    //         createdAt: parent.createdAt
    //     })

    //     await this.commentRepository.updateHotScore(parent.id, hotScore)
    // }

    // async onReactionChanged(commentId: string) {
    //     const comment = await this.commentRepository.findForRanking(commentId)

    //     const hotScore = this.calculateHotScore({
    //         upvotes: comment.upvotes,
    //         downvotes: comment.downvotes,
    //         replies: comment.directReplyCount,
    //         createdAt: comment.createdAt
    //     })

    //     await this.commentRepository.updateHotScore(comment.id, hotScore)
    // }

    // async calculateHotScore() {}
}
