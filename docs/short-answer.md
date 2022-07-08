# Short Answer
Represents a short answer question where there can be one or many blanks.

<img src="./screenshots/short-answer.png" alt="Short Answer Question" width="500">

## Usage (Presentational)

```html
<script type="module">
    import '@brightspace-hmc/questions/components/d2l-questions-short-answer-presentational.js';
</script>
<d2l-questions-short-answer-presentational
	question-text=""
	.blanks=${blanks}
	>
</d2l-questions-short-answer-presentational>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| blanks | Array | Object representing the question's blanks and user's responses. |
| question-text | String | Question text - will be parsed as HTML |

**Example Blanks:**
```JSON
[
	{
		"responseText": "correct answer",
		"correctAnswerText": "correct answer",
		"value": 10,
		"correct": true

	},
	{
		"responseText": "green",
		"correctAnswerText": "blue",
		"value": 0,
		"correct": false
	}
]
```
