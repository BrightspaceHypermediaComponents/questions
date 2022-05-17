# Multi Select
Represents a multi select question where multiple options are selectable.

**Default**

<img src="./screenshots/multi-select-answerable.png" alt="Multi Select Question" width="500">

**Readonly**

<img src="./screenshots/multi-select-readonly.png" alt="Multi Select Question Readonly" width="500">


## Usage (Presentational)

```html
<script type="module">
    import '@brightspace-hmc/questions/components/d2l-questions-multi-select-presentational.js';
</script>
<d2l-questions-multi-select-presentational
	readonly
	question-text=""
	.choices=${choices}
	>
</d2l-questions-multi-select-presentational>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| choices | Array | Object representing the possible answers and their selected state. Example below. |
| question-text | String | Question text - will be parsed as HTML |
| readonly | Boolean | If true, the question is not clickable/ answerable and will display answer correctness if provided. |

**Example Choices:**
```JSON
[
	{
		"htmlText": "<s>Mistake</s> Apple",
		"text": "Mistake Apple",
		"selected": false,
		"correct": false
	},
	{
		"htmlText": "<p>Ocean</p>",
		"text": "Ocean",
		"selected": false,
		"correct": true
	},
	{
		"htmlText": "<p>Oil and a very long answer for testing. lorem ipsum dolor sit amet, consecteteur adipiscing elit.</p>",
		"text": "Oil and a very long answer for testing. lorem ipsum dolor sit amet, consecteteur adipiscing elit.",
		"selected": true,
		"correct": false
	},
	{
		"htmlText": "<p>Sun</p>",
		"text": "Sun",
		"selected": false,
		"correct": false
	}
]
```
