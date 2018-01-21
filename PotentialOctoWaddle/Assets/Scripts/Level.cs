using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

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
}
