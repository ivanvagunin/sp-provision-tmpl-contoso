import * as $ from "jquery";
import * as Handlebars from "handlebars";

export class HomePage {
    private appendTemplate(src: string, parent:string, data: any): void {
        let template:any = Handlebars.compile(src);
        let html:any = template(data);
        $(parent).append(html);
    }

    public Main(): void {
        $("#sideNavBox").hide();
        $("#contentBox").css("margin-left", "20px");
        setInterval(() => {
             var img:any = $("#banner");
             img.attr("src", img.attr("src"));
        }, 15000);

        let links: Array<any> = [
            {title:"Contoso Ltd.", url:"#"},
            {title:"Contoso Bank", url:"#"},
            {title:"Contoso Hotel", url:"#"},
            {title:"Contoso Pharmaceuticals", url:"#"}
        ];
        let src:string = require("../Pages/Footer.html");
        this.appendTemplate(src, "#s4-workspace", {links: links});

        let news: Array<any> = [
            {
                title: "Learn Exactly How We Made Productivity Last Month",
                body: "Suspendisse vel mollis ex. Interdum et malesuada fames ac ante ipsum primis in faucibus." +
                 "Aliquam hendrerit quis mi ac tincidunt. Aenean semper pretium malesuada. Suspendisse potenti.",
                url:"#"
            },
            {
                title: "Fascinating Clients Tactics That Can Help Your Business Grow",
                body: "Nullam convallis, ante at vehicula semper, nisi ipsum auctor tortor, non efficitur libero" +
                " sem at tortor. Nulla nunc augue, vehicula eget est ac, cursus pretium mi.",
                url:"#"
            },
            {
                title: "This Study Will Perfect Your Work: Read Or Miss Out",
                body: "Curabitur porta libero eu tellus porta egestas. In nibh ante, varius vitae vestibulum in, " +
                "consequat aliquet nisi. Maecenas ultricies arcu vitae iaculis faucibus.",
                url:"#"
            },
            {
                title: "Don't Just Sit There! Start Report",
                body:"In et ultricies diam. In auctor fermentum neque, vitae convallis nulla hendrerit non. Pellentesque" +
                " rhoncus, justo eu lacinia lobortis, lacus sapien fermentum magna, ut auctor tortor augue vitae arcu. ",
                url:"#"
            }
        ];
        src = require("../Pages/News.html");
        this.appendTemplate(src, "#newsArea", {news: news});
    }
}