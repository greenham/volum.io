import React from "react";
import { Container, Form, Image, Table } from "react-bootstrap";
// import logoImageUrl from "./assets/logo-128.png";
import densities from "./densities.json";
const ingredients = densities.map((d) => d.name);
type TRecipeLine = {
  amount?: number;
  unit?: string;
  ingredient?: string;
};

const unitToGramsMap = new Map<string, number>([
  ["ml", 1],
  ["dl", 100],
  ["l", 1000],
  ["t", 5],
  ["T", 15],
  ["floz", 29.6],
  ["c", 237],
  ["pt", 473],
  ["qt", 946],
  ["gal", 3785],
]);
const gramsPerPound = 453;
const gramsPerOunce = 28;

function App() {
  // https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/
  const [recipeLines, setRecipeLines] = React.useState<TRecipeLine[]>([
    { amount: 1, unit: "c", ingredient: "butter" },
    { amount: 1, unit: "c", ingredient: "sugar" },
    { amount: 1, unit: "c", ingredient: "sugar, brown" },
    { amount: 2, unit: "whole", ingredient: "egg" },
    { amount: 2, unit: "t", ingredient: "vanilla extract" },
    { amount: 1, unit: "t", ingredient: "baking soda" },
    { amount: 2, unit: "t", ingredient: "water" },
    { amount: 0.5, unit: "t", ingredient: "salt, table" },
    { amount: 3, unit: "c", ingredient: "flour" },
    { amount: 2, unit: "c", ingredient: "chocolate chips" },
    { amount: 1, unit: "c", ingredient: "walnuts, chopped" },
  ]);
  return (
    <Container>
      {/* <Image src={logoImageUrl} /> */}
      <datalist id="ingredients">
        {ingredients.map((i, idx) => (
          <option value={i} key={idx} />
        ))}
      </datalist>
      <Table striped variant="dark">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>Amount</th>
            <th style={{ width: "20%" }}>Unit</th>
            <th>Ingredient</th>
            <th style={{ width: "12%" }}>Grams</th>
            <th style={{ width: "12%" }}>Pounds</th>
            <th style={{ width: "12%" }}>Ounces</th>
          </tr>
        </thead>
        <tbody>
          <RecipeLine />
          {recipeLines.map((line, idx) => (
            <RecipeLine line={line} key={idx} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

type TRecipeLineProps = {
  line?: TRecipeLine;
};
function RecipeLine(props: TRecipeLineProps) {
  const { line } = props;
  const [amount, setAmount] = React.useState(line?.amount || undefined);
  const [unit, setUnit] = React.useState(line?.unit || "t");
  const [ingredient, setIngredient] = React.useState(line?.ingredient || "");
  const [grams, setGrams] = React.useState("");
  const [pounds, setPounds] = React.useState("");
  const [ounces, setOunces] = React.useState("");

  React.useEffect(() => {
    if (amount && unit && ingredient) {
      let grams;
      if (unit === "oz" || unit === "lb") {
        // straight conversion, no density needed
        grams = amount * (unit === "oz" ? gramsPerOunce : gramsPerPound);
      } else {
        const density = densities.find((d) => d.name === ingredient);
        if (density) {
          grams = density.g_whole
            ? amount * density.g_whole
            : amount * density.g_ml * unitToGramsMap.get(unit)!;
        } else {
          // no density found, assume 1 g/ml
          grams = amount * unitToGramsMap.get(unit)!;
        }
      }
      if (grams >= 1000) {
        setGrams((grams / 1000).toFixed(2) + " kg");
      } else {
        setGrams(grams.toFixed(2) + " g");
      }

      const pounds = grams / gramsPerPound;
      const ounces = grams / gramsPerOunce;
      setPounds(pounds.toFixed(2) + " lb");
      setOunces(ounces.toFixed(2) + " oz");
    } else {
      setGrams("");
      setPounds("");
      setOunces("");
    }
  }, [amount, unit, ingredient]);

  return (
    <tr>
      <td>
        <Form.Control
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          size="lg"
        />
      </td>
      <td>
        <Form.Select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          size="lg"
        >
          <optgroup label="US Volume">
            <option value="t">teaspoons</option>
            <option value="T">tablespoons</option>
            <option value="floz">fluid ounces</option>
            <option value="c">cups</option>
            <option value="pt">pints</option>
            <option value="qt">quarts</option>
            <option value="gal">gallons</option>
          </optgroup>
          <optgroup label="Metric Volume">
            <option value="ml">milliliters</option>
            <option value="dl">deciliters</option>
            <option value="l">liters</option>
          </optgroup>
          <optgroup label="Weights">
            <option value="oz">ounces</option>
            <option value="lb">pounds</option>
          </optgroup>
          <option value="whole" disabled>
            whole
          </option>
        </Form.Select>
      </td>
      <td>
        <Form.Control
          type="text"
          list="ingredients"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          onBlur={(e) => setIngredient(e.target.value)}
          placeholder="Start typing an ingredient..."
          size="lg"
        />
      </td>
      <td className="fs-2 text-primary">{grams}</td>
      <td className="fs-3 text-secondary">{pounds}</td>
      <td className="fs-3 text-secondary">{ounces}</td>
    </tr>
  );
}

export default App;
