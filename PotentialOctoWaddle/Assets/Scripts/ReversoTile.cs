using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class ReversoTile : MonoBehaviour {

    public bool state = true;
    private Quaternion inRotation;
    private Quaternion outRotation;
    public Level level;
    public int I;
    public int J;

    public void Start() {
        this.inRotation = this.transform.localRotation;
        this.outRotation = Quaternion.AngleAxis(180f, Vector3.right) * this.inRotation;
    }

    public void InitializeState(Boolean state) {
        this.state = state;
        if (this.state) {
            this.transform.localRotation = this.inRotation;
        } else {
            this.transform.localRotation = this.outRotation;
        }
    }

    public void Flip(bool isFirst) {
        if (this.state) {
            StartCoroutine(this.FlipOut(
                1f,
                () => {
                    if (isFirst) {
                        for (int i = -1; i <= 1; i++) {
                            for (int j = -1; j <= 1; j++) {
                                if (i != 0 || j != 0) {
                                    ReversoTile tile = this.level.GetTile(this.J + j, this.I + i);
                                    if (tile != null) {
                                        tile.Flip(false);
                                    }
                                }
                            }
                        }
                    }
                }
            ));
        }
        else {
            StartCoroutine(this.FlipIn(
                1f,
                () => {
                    if (isFirst) {
                        for (int i = -1; i <= 1; i++) {
                            for (int j = -1; j <= 1; j++) {
                                if (i != 0 || j != 0) {
                                    ReversoTile tile = this.level.GetTile(this.J + j, this.I + i);
                                    if (tile != null) {
                                        tile.Flip(false);
                                    }
                                }
                            }
                        }
                    }
                }
            ));
        }
    }

	public IEnumerator FlipIn(
        float duration,
        Action midCallback = null,
        Action callback = null
    ) {
		float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			this.transform.localRotation = Quaternion.Slerp(this.outRotation, this.inRotation, dt / duration);
            if (midCallback != null && dt >= duration * 0.5f) {
                midCallback();
                midCallback = null;
            }
			yield return null;
		}
        this.transform.localRotation = this.inRotation;
        this.state = true;
        if (callback != null) {
            callback();
        }
	}

	public IEnumerator FlipOut(
        float duration,
        Action midCallback = null,
        Action callback = null
    ) {
		float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			this.transform.localRotation = Quaternion.Slerp(this.inRotation, this.outRotation, dt / duration);
            if (midCallback != null && dt >= duration * 0.5f) {
                midCallback();
                midCallback = null;
            }
			yield return null;
		}
        this.transform.localRotation = this.outRotation;
        this.state = false;
        if (callback != null) {
            callback();
        }
	}

    public void OnMouseDown() {
		Debug.Log ("Tile Click");
		this.Flip(true);
	}
}
