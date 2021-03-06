"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Candy = require("candyjs/Candy");
const View = require("candyjs/web/View");
const Handlebars = require("handlebars");
/**
 * 视图
 */
class Index extends View {
    constructor(context) {
        super(context);
        /**
         * @property {Boolean} enableLayout 是否开启布局视图
         */
        this.enableLayout = false;
        /**
         * @property {String} layout 布局文件路径
         */
        this.layout = '@app/views/layout';
        /**
         * @property {String} title 页面标题
         */
        this.title = '';
        /**
         * @property {String} description 页面描述
         */
        this.description = '';
        /**
         * @property {String} contentHtml 内容 html
         */
        this.contentHtml = '';
        this.handlebars = Handlebars.create();
    }
    /**
     * 渲染文件
     */
    async renderFile(file, parameters) {
        let viewData = await fs.promises.readFile(file, { encoding: Candy.app.encoding });
        let compiled = this.handlebars.compile(viewData);
        this.contentHtml = compiled(parameters);
        if (this.enableLayout) {
            let layoutFile = Candy.getPathAlias(this.layout + this.defaultExtension);
            let layoutData = await fs.promises.readFile(layoutFile, { encoding: Candy.app.encoding });
            compiled = this.handlebars.compile(layoutData);
            this.contentHtml = compiled({
                $parameters: parameters,
                title: this.title,
                description: this.description,
                contentHtml: this.contentHtml
            });
        }
        this.context.response.end(this.contentHtml);
    }
}
exports.default = Index;
