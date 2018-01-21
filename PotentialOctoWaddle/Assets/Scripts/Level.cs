using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.IO;

public class Level : MonoBehaviour {

	public static Level _Instance;
	public static Level Instance {
		get {
			if (!Level._Instance) {
				Level._Instance = Resources.FindObjectsOfTypeAll<Level> ()[0];
			}
			return Level._Instance;
		}
	}

	public ReversoTile[][] tiles;

	public void Start() {
		this.tiles = new ReversoTile[3][];
		for (int j = 0; j < 3; j++) {
			this.tiles[j] = new ReversoTile[4];
			for (int i = 0; i < 4; i++) {
				GameObject g = GameObject.Find("Tile-" + j + "-" + i);
				ReversoTile tile = g.GetComponent<ReversoTile>();
				if (tile != null) {
					Debug.Log("Tile-" + j + "-" + i + " found");
					tile.level = this;
					tile.I = i;
					tile.J = j;
					this.tiles[j][i] = tile;
				} else {
					Debug.LogError("Tile-" + j + "-" + i + " not found");
				}
			}
		}
	}

	public ReversoTile GetTile(int j, int i) {
		if (j >= 0 && j < this.tiles.Length) {
			if (i >= 0 && i < this.tiles[j].Length) {
				return this.tiles[j][i];
			}
		}
		return null;
	}
	public void Initialize(
		int index,
		Action callback = null
	) {
		LevelData data = null;
		string filePath = Application.dataPath + "/Levels/" + index + ".json";
		Debug.Log("Load level " + index + " at path " + filePath);

        if (File.Exists (filePath)) {
            string dataAsJson = File.ReadAllText (filePath);
            data = JsonUtility.FromJson<LevelData> (dataAsJson);
        }
		if (data != null) {
			Debug.Log(JsonUtility.ToJson(data));
			for (int j = 0; j < 3; j++) {
				for (int i = 0; i < 4; i++) {
					if (data.initialValues[j * 4 + i] == 1) {
						this.tiles[j][i].InitializeState(true);
					} else {
						this.tiles[j][i].InitializeState(false);
					}
				}
			}
			if (callback != null) {
				callback();
			}
		}
	}
}
