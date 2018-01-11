class MainMenu {

    public static Open(): void {
        $.ajax(
            {
                url: "./views/main-menu.html",
                success: (data) => {
                    Page.Clear();
                    document.getElementById("page").innerHTML = data;

                    document.getElementById("level-selection").onclick = () => {
                        LevelSelection.Open();
                    }
                }
            }
        );
    }
}