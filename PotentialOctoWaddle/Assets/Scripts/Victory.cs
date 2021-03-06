using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Victory : MonoBehaviour {
	public Material greyStar;
	public Material yellowStar;
    public GameObject titleStripe;
    private Vector3 titleStripeInPosition;
    public TMPro.TextMeshPro titleText;
    public GameObject turnsStripe;
    private Vector3 turnsStripeInPosition;
    public TMPro.TextMeshPro turnsText;
    public GameObject starsStripe;
    private Vector3 starsStripeInPosition;
    public Renderer star1;
    public Renderer star2;
    public Renderer star3;

	public static Victory _Instance;
	public static Victory Instance {
		get {
			if (!Victory._Instance) {
				Victory._Instance = Resources.FindObjectsOfTypeAll<Victory> ()[0];
			}
			return Victory._Instance;
		}
	}

    public void Start() {
        this.titleStripeInPosition = this.titleStripe.transform.localPosition;
        this.turnsStripeInPosition = this.turnsStripe.transform.localPosition;
        this.starsStripeInPosition = this.starsStripe.transform.localPosition;
        this.Reset();
    }

    public void Reset() {
        this.titleStripe.transform.localPosition = new Vector3(10, 0, 0);
        this.turnsStripe.transform.localPosition = new Vector3(-10, 0, 0);
        this.starsStripe.transform.localPosition = new Vector3(10, 0, 0);
        this.titleText.transform.localScale = new Vector3(0, 0, 0);
        this.turnsText.transform.localScale = new Vector3(0, 0, 0);
        this.star1.transform.localScale = new Vector3(0, 0, 0);
        this.star2.transform.localScale = new Vector3(0, 0, 0);
        this.star3.transform.localScale = new Vector3(0, 0, 0);
    }
    public void SetTurns(int turns) {
        this.turnsText.text = "TURNS : " + turns;
    }

    public void SetScore(int score) {
        if (score >= 1) {
            this.star1.material = this.yellowStar;
        } else {
            this.star1.material = this.greyStar;
        }
        if (score >= 2) {
            this.star2.material = this.yellowStar;
        } else {
            this.star2.material = this.greyStar;
        }
        if (score >= 3) {
            this.star3.material = this.yellowStar;
        } else {
            this.star3.material = this.greyStar;
        }
    }
		
	public void Show() {
        this.transform.localPosition = new Vector3(0, 0, 0);
        StartCoroutine(
            this.ShowAnim(
                this.titleStripe,
                this.titleStripeInPosition,
                0.5f,
                () => {
                    StartCoroutine(this.Pop(this.titleText.gameObject, new Vector3(1, 1, 1), 0.5f));
                    StartCoroutine(
                        this.ShowAnim(
                            this.turnsStripe,
                            this.turnsStripeInPosition,
                            0.5f,
                            () => {
                                StartCoroutine(this.Pop(this.turnsText.gameObject, new Vector3(1, 1, 1), 0.5f));
                                StartCoroutine(
                                    this.ShowAnim(
                                        this.starsStripe,
                                        this.starsStripeInPosition,
                                        0.5f,
                                        () => {
                                            StartCoroutine(this.Pop(
                                                this.star1.gameObject, new Vector3(0.08f, 0.08f, 0.08f), 0.5f,
                                                () => {
                                                    StartCoroutine(this.Pop(
                                                        this.star2.gameObject, new Vector3(0.1f, 0.1f, 0.1f), 0.5f,
                                                        () => {
                                                            StartCoroutine(this.Pop(this.star3.gameObject, new Vector3(0.08f, 0.08f, 0.08f), 0.5f));
                                                        }
                                                    ));
                                                }
                                            ));
                                        }
                                    )
                                );
                            }
                        )
                    );
                }
            )
        );
    }

    public void Hide() {
        this.Reset();
        this.transform.localPosition = new Vector3(0, 10, 0);
    }

    private IEnumerator ShowAnim(GameObject target, Vector3 newPosition, float duration, Action callback = null) {
        Vector3 initialPosition = target.transform.localPosition;
        float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			target.transform.localPosition = Vector3.Lerp(initialPosition, newPosition, dt / duration);
			yield return null;
		}
        target.transform.localPosition = newPosition;
        if (callback != null) {
            callback();
        }
    }
    private IEnumerator Pop(GameObject target, Vector3 newScale, float duration, Action callback = null) {
        Vector3 initialScale = target.transform.localScale;
        float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			target.transform.localScale = Vector3.Lerp(initialScale, newScale, dt / duration);
			yield return null;
		}
        target.transform.localScale = newScale;
        if (callback != null) {
            callback();
        }
    }
}
