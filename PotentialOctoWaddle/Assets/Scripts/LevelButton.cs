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
	private int _score;
	public int score {
		get {
			return this._score;
		}
		set {
			this._score = value;
			if (this._score >= 1) {
				Renderer renderer = this.star1.GetComponent<Renderer>();
				if (renderer) {
					renderer.material = Victory.Instance.yellowStar;
				}
			}
			if (this._score >= 2) {
				Renderer renderer = this.star2.GetComponent<Renderer>();
				if (renderer) {
					renderer.material = Victory.Instance.yellowStar;
				}
			}
			if (this._score >= 3) {
				Renderer renderer = this.star3.GetComponent<Renderer>();
				if (renderer) {
					renderer.material = Victory.Instance.yellowStar;
				}
			}
		}
	}

	public TextMeshPro textMesh;
	public GameObject star1;
	public GameObject star2;
	public GameObject star3;

	public void OnMouseDown() {
		Debug.Log ("LevelButton Click");
		this.Squish(
			0.15f,
			0.9f,
			() => {
				Level.Instance.Initialize(
					this.index,
					() => {
						ReversoCamera.Instance.GoTo(
							0.5f,
							ReversoState.Level
						);
					}
				);
			}
		);
	}
}
