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

	private Transform _tileContainer;
	private Transform tileContainer {
		get {
			if (!this._tileContainer) {
				this._tileContainer = GameObject.Find("TileContainer").transform;
			}
			return this._tileContainer;
		}
	}
	public GameObject tilePrefab;
	public ReversoTile[][] tiles;
	public TMPro.TextMeshPro title;
	public int turns = 0;
	public int best = 0;
	public int index = 0;
	private int locks = 0;
	private int width = 1;
	private int height = 1;

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
		if (this.tiles != null) {
			for (int j = 0; j < this.tiles.Length; j++) {
				for (int i = 0; i < this.tiles[j].Length; i++) {
					GameObject.Destroy(this.tiles[j][i].gameObject);
				}
			}
		}
		LevelData data = null;
		TextAsset dataAsText = Resources.Load<TextAsset>("Levels/" + index);
		if (dataAsText) {
            data = JsonUtility.FromJson<LevelData> (dataAsText.text);
		}
		if (data != null) {
			this.width = data.width;
			this.height = data.height;
			this.InstantiateTiles(data);
			this.locks = 0;
			this.title.text = "LEVEL " + index;
			this.index = index;
			this.turns = 0;
			this.best = data.best;
			for (int j = 0; j < this.height; j++) {
				for (int i = 0; i < this.width; i++) {
					if (data.initialValues[j * this.width + i] == 1) {
						this.tiles[j][i].InitializeState(true);
						Debug.Log("TRUE");
					} else {
						this.tiles[j][i].InitializeState(false);
						Debug.Log("FALSE");
					}
				}
			}
			if (callback != null) {
				callback();
			}
		}
	}

	public void InstantiateTiles(LevelData data) {
		float s = Mathf.Min(3.5f / data.width, 4f / data.height);
		Debug.Log("S = " + s);
		this.tiles = new ReversoTile[data.height][];
		for (int j = 0; j < data.height; j++) {
			this.tiles[j] = new ReversoTile[data.width];
			for (int i = 0; i < data.width; i++) {
				GameObject instance = GameObject.Instantiate<GameObject>(this.tilePrefab);
				instance.transform.parent = this.tileContainer;
				instance.transform.localPosition = s * (new Vector3(- (data.width - 1f) / 2f + i, (data.height - 1f) / 2f - j, 0f));
				instance.transform.localScale = 0.95f * (new Vector3(s, s, s));
				ReversoTile tile = instance.GetComponent<ReversoTile>();
				if (tile != null) {
					tile.level = this;
					tile.I = i;
					tile.J = j;
					this.tiles[j][i] = tile;
				}
				Transform pictureInstance = instance.transform.Find("Picture");
				if (pictureInstance != null) {
					MeshFilter meshFilter = pictureInstance.GetComponent<MeshFilter>();
					if (meshFilter != null) {
						Mesh mesh = meshFilter.mesh;
						List<Vector2> uvs = new List<Vector2>();
						uvs.Add(new Vector2(
							data.picOffsetX / 4f + i / 4f / (float) data.step,
							1f - data.picOffsetY / 3f - (j + 1) / 3f / (float) data.step
						));
						uvs.Add(new Vector2(
							data.picOffsetX / 4f + i / 4f / (float) data.step,
							1f - data.picOffsetY / 3f - j / 3f / (float) data.step
						));
						uvs.Add(new Vector2(
							data.picOffsetX / 4f + (i + 1) / 4f / (float) data.step,
							1f - data.picOffsetY / 3f - j / 3f / (float) data.step
						));
						uvs.Add(new Vector2(
							data.picOffsetX / 4f + (i + 1) / 4f / (float) data.step,
							1f - data.picOffsetY / 3f - (j + 1) / 3f / (float) data.step
						));
						/*
						uvs.Add(new Vector2(
							0, 0
						));
						uvs.Add(new Vector2(
							0, 1
						));
						uvs.Add(new Vector2(
							1, 1
						));
						uvs.Add(new Vector2(
							1, 0
						));
						*/
						mesh.SetUVs(0, uvs);
					}
				}
			}
		}
	}

	public void Restart() {
		Victory.Instance.Hide();
		this.turns = 0;
		for (int j = 0; j < this.height; j++) {
			for (int i = 0; i < this.width; i++) {
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
		for (int j = 0; j < this.height; j++) {
			for (int i = 0; i < this.width; i++) {
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
