# Multi Select
Represents a multi select question where multiple options are selectable. There may be 0, 1 or many correct options.

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
		"htmlText": "Option 1",
		"text": "Option 1",
		"selected": false,
		"correct": true
	},
	{
		"htmlText": "Option 2",
		"text": "Option 2",
		"selected": true,
		"correct": true
	},
	{
		"htmlText": "Option 3",
		"text": "Option 3",
		"selected": false,
		"correct": false
	},
	{
		"htmlText": "Option 4",
		"text": "Option 4",
		"selected": false,
		"correct": false
	}
]
```
