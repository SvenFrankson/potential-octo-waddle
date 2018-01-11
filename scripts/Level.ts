class ILevelData {
    width: number;
    height: number;
    initialValues: number[][];
}

class Level {

    private _index: number = 0;
    private _width: number = 1;
    private _height: number = 1;
    private _values: number[][] = [];

    constructor(index: number) {
        this._index = index;
    }

    public open(): void {
        $.ajax(
            {
                url: "./views/level.html",
                success: (data) => {
                    Page.Clear();
                    document.getElementById("page").innerHTML = data;
                    
                    document.getElementById("back-main-menu").onclick = () => {
                        LevelSelection.Open();
                    }

                    this.initialize();
                }
            }
        );
    }

    public initialize(): void {
        $.ajax(
            {
                url: "./levels/" + this._index + ".json",
                success: (data: ILevelData) => {
                    this._width = data.width;
                    this._height = data.height;
                    this._values = data.initialValues;
                    alert("Loaded " + this._width + " x " + this._height + " grid.");
                }
            }
        );
    }
}