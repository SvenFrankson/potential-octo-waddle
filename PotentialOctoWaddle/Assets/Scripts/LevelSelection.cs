﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelSelection : MonoBehaviour {

	public static LevelSelection _Instance;
	public static LevelSelection Instance {
		get {
			if (!LevelSelection._Instance) {
				LevelSelection._Instance = Resources.FindObjectsOfTypeAll<LevelSelection> ()[0];
			}
			return LevelSelection._Instance;
		}
	}

	public GameObject levelIconPrefab;
	private Dictionary<int, LevelButton> buttons = new Dictionary<int, LevelButton>();

	public void Start() {
		for (int i = 0; i < 4; i++) {
			for (int j = 0; j < 4; j++) {
				GameObject icon = Instantiate<GameObject>(this.levelIconPrefab);
				icon.transform.parent = this.transform;
				icon.transform.localPosition = new Vector3(-1.5f + i, 1.3f - j, 6);
				icon.transform.localRotation = Quaternion.identity;
				LevelButton button = icon.GetComponent<LevelButton>();
				if (button) {
					int index = i + j * 4 + 1;
					this.buttons.Add(index, button);
					button.index = index;
					Debug.Log("Index = " + index + " Score = " + ScoreManager.Instance.GetScore(index));
					button.score = ScoreManager.Instance.GetScore(index);
				}
			}
		}
	}

	public void UpdateScore(int index) {
		this.buttons[index].score = ScoreManager.Instance.GetScore(index);
	}
}
