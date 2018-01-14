class LevelSelection {

    public scores: Map<number, number>;

    public static Open(): LevelSelection {
        let levelSelection = new LevelSelection();
        levelSelection.open();
        return levelSelection;
    }

    constructor() {
        this.scores = new Map<number, number>();
        for (let i = 0; i < 16; i++) {
            let index = i + 1;
            this.scores.set(index, ScoreManager.getScore(index));;
        }
    }

    public open(): void {
        $.ajax(
            {
                url: "./views/level-selection.html",
                success: (data) => {
                    Page.Clear();
                    document.getElementById("page").innerHTML = data;
                    
                    document.getElementById("back-main-menu").onpointerup = () => {
                        MainMenu.Open();
                    }

                    this.populate();
                }
            }
        );
    }

    public populate(): void {
        $.ajax(
            {
                url: "./views/level-icon-template.html",
                success: (template) => {
                    console.log(this.scores);
                    let rowCount: number = 4;
                    let levelsByRow: number = 4;
                    for (let i = 0; i < rowCount; i++) {
                        let row = document.createElement("div");
                        document.getElementById("levels").appendChild(row);
                        row.className = "row level-icon-row";
                        for (let j = 0; j < levelsByRow; j++) {
                            let level = document.createElement("div");
                            row.appendChild(level);
                            level.className = "col-xs-3 level-icon-cell";

                            let index = (i * rowCount + j + 1).toFixed(0);
                            let text : string = template;
                            let templateElement = document.createElement('template');
                            text = text.split("{{ id }}").join("level-" + index);
                            text = text.split("{{ level }}").join(index);
                            text = text.trim();
                            templateElement.innerHTML = text;
                            level.appendChild(templateElement.content.firstChild)
                        }
                    }
                    for (let i = 0; i < rowCount; i++) {
                        for (let j = 0; j < levelsByRow; j++) {
                            let index = i * rowCount + j + 1;
                            document.getElementById("level-" + index.toFixed(0)).onpointerup = () => {
                                let level = new Level(index);
                                level.open();
                            }
                            let score = this.scores.get(index);
                            console.log(score);
                            for (let k = 1; k <= score; k++) {
                                document.getElementById("level-" + index.toFixed(0) + "-star-" + k).setAttribute("src", "./img/star-yellow.svg");
                            }
                        }
                    }
                }
            }
        );
    }
}