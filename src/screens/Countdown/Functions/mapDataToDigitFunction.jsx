import mapping from "../../Mapping";

function mapDataToDigitFunction(input) {
  const mappedItem = mapping.find(
    (item) =>
      item.input.replace(/[\s,]/g, "") ===
      input.toString().replace(/[\s,]/g, "")
  );

  if (mappedItem) {
    let number = mappedItem.number.toString();
    let point = mappedItem.point.toString();
    let type = "";
    let char = mappedItem.type.toString();

    switch (mappedItem.type) {
      case "s":
        type = "SINGLE";
        break;
      case "skip":
        type = "SKIP";
        break;
      case "d":
        type = "DOUBLE";
        break;
      case "t":
        type = "TRIPLE";
        break;
      default:
        type = "SINGLE";
        break;
    }
    return [number, point, type, char];
  } else {
    return "0"; // Default value for unmapped inputs
  }
}

export { mapDataToDigitFunction };
