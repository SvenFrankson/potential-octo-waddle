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
	public TMPro.TextMeshPro title;
	public int turns = 0;
	public int best = 0;
	public int index = 0;
	private int locks = 0;

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

	public void Lock() {
		this.locks++;
	}

	public void UnLock() {
		this.locks--;
	}
	public bool IsLocked() {
		return this.locks != 0;
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
		Victory.Instance.Hide();
		LevelData data = null;
		TextAsset dataAsText = Resources.Load<TextAsset>("Levels/" + index);
		if (dataAsText) {
            data = JsonUtility.FromJson<LevelData> (dataAsText.text);
		}
		if (data != null) {
			this.locks = 0;
			this.title.text = "LEVEL " + index;
			this.index = index;
			this.turns = 0;
			this.best = data.best;
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

	public void Restart() {
		Victory.Instance.Hide();
		this.turns = 0;
		for (int j = 0; j < 3; j++) {
			for (int i = 0; i < 4; i++) {
				this.tiles[j][i].Restart();
			}
		}
	}

	public void OnTileFliped() {
		this.turns ++;
		if (this.CheckVictory()) {
			Debug.Log("You win in " + this.turns + " turns (best is " + this.best + ")");
			ScoreManager.Instance.SetScore(this.index, this.GetScore());
			LevelSelection.Instance.UpdateScore(this.index);
			Victory.Instance.SetTurns(this.turns);
			Victory.Instance.SetScore(this.GetScore());
			Victory.Instance.Show();
		}
	}
	public bool CheckVictory() {
		Debug.Log("Check Victory");
		for (int j = 0; j < 3; j++) {
			for (int i = 0; i < 4; i++) {
				if (!this.tiles[j][i].state) {
					Debug.Log("No Victory");
					return false;
				}
			}
		}
		Debug.Log("Ok Victory");
		return true;
	}

	public int GetScore() {
		if (this.turns <= this.best) {
			return 3;
		} else if (this.turns <= this.best * 2) {
			return 2;
		} else {
			return 1;
		}
	}
}
