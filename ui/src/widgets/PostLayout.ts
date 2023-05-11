import { Post } from "../APIClient"

export class PostLayout extends OO.ui.HorizontalLayout {
    timstamp_label: OO.ui.LabelWidget
    login_label: OO.ui.LabelWidget
    message_label: OO.ui.LabelWidget
    post: Post

    constructor(post: Post, config?: OO.ui.HorizontalLayout.ConfigOptions) {
        super(config)

        this.timstamp_label = new OO.ui.LabelWidget()
        this.login_label = new OO.ui.LabelWidget()
        this.message_label = new OO.ui.LabelWidget()
        this.addItems([this.timstamp_label, this.login_label, this.message_label])

        this.post = post
        this.setPost(post)
    }

    setPost(post: Post) {
        this.post = post
        this.timstamp_label.setLabel(`${this.post.timestamp.getHours()}:${this.post.timestamp.getMinutes()}:${this.post.timestamp.getSeconds()}`)
        this.login_label.setLabel(`<${this.post.login}>`)
        this.message_label.setLabel(this.post.message)
    }
}
