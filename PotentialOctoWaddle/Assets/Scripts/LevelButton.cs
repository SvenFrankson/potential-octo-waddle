using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class LevelButton : Button3D {

	private int _index;
	public int index {
		get {
			return this._index;
		}
		set {
			this._index = value;
			this.textMesh.text = "" + this._index;
		}
	}

	public TextMeshPro textMesh;
	public GameObject star1;
	public GameObject star2;
	public GameObject star3;

	public void OnMouseDown() {
		Debug.Log ("LevelButton Click");
		ReversoCamera.Instance.GoTo(
			0.5f,
			ReversoState.Play,
			() => {
				
			}
		);
	}
}
