class LevelSelection {

    public static Open(): void {
        $.ajax(
            {
                url: "./views/level-selection.html",
                success: (data) => {
                    Page.Clear();
                    document.getElementById("page").innerHTML = data;
                    
                    document.getElementById("back-main-menu").onclick = () => {
                        MainMenu.Open();
                    }

                    LevelSelection.Populate();
                }
            }
        );
    }

    public static Populate(): void {
        $.ajax(
            {
                url: "./views/level-icon-template.html",
                success: (template) => {
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

                            let index = (i * rowCount + j).toFixed(0);
                            let text = template;
                            let templateElement = document.createElement('template');
                            text = text.replace("{{ id }}", "level-" + index);
                            text = text.replace("{{ level }}", index);
                            text = text.trim();
                            templateElement.innerHTML = text;
                            level.appendChild(templateElement.content.firstChild)
                        }
                    }
                    for (let i = 0; i < rowCount; i++) {
                        for (let j = 0; j < levelsByRow; j++) {
                            let index = i * rowCount + j;
                            document.getElementById("level-" + index.toFixed(0)).onclick = () => {
                                let level = new Level(index);
                                level.open();
                            }
                        }
                    }
                }
            }
        );
    }
}