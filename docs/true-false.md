# True & False
NOTE: True & False question types use the same component as multiple-choice but with the `isTrueFalse` flag
Represents a true-false question where only one option is selectable.

**Default**

<img src="./screenshots/true-false-answerable.png" alt="True & False Question" width="500">

**Readonly**

<img src="./screenshots/true-false-readonly.png" alt="True & False Question Readonly" width="500">


## Usage (Presentational)

```html
<script type="module">
    import '@brightspace-hmc/questions/components/d2l-questions-multiple-choice-presentational.js';
</script>

<d2l-questions-multiple-choice-presentational
	isTrueFalse
	readonly
	question-text=""
	.choices=${choices}
	>
</d2l-questions-multiple-choice-presentational>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| choices | Array | Object representing the possible answers and their selected state. Example below. |
| isTrueFalse | Boolean | If true, the question choices will only show two options and be translated (true & false) |
| question-text | String | Question text - will be parsed as HTML |
| readonly | Boolean | If true, the question is not clickable/ answerable and will display answer correctness if provided. |

**Example Choices:**
```JSON
[
	{
		"htmlText": "<s>True</s> ",
		"text": "True",
		"selected": false,
		"correct": false
	},
	{
		"htmlText": "<p>False</p>",
		"text": "False",
		"selected": false,
		"correct": true
	}
]
```
