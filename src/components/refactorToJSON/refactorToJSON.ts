const refactorToJSON = (input: string): string => {
  // Trim whitespace from both ends of the input
  let trimmedInput = input.trim();

  // Check if the first character is '{' and the last character is '}'
  if (!trimmedInput.startsWith('{')) {
    trimmedInput = '{' + trimmedInput;
  }
  if (!trimmedInput.endsWith('}')) {
    trimmedInput = trimmedInput + '}';
  }

  // Replace equals sign with a colon when it appears between a key and a value
  let jsonLike = trimmedInput.replace(
    /([{,]\s*)([a-zA-Z_][\w]*)(\s*)=(\s*)([\w"]+)/g,
    '$1"$2": $5'
  );

  // Attempt to insert missing commas
  jsonLike = jsonLike.replace(
    /(\s*[\w"]+\s*:\s*[\w"]+)(\s+)(?=[\w"]+\s*:)/g,
    '$1,$2'
  );

  // Add double quotes around the keys
  jsonLike = jsonLike.replace(/([{,]\s*)([a-zA-Z_][\w]*)(\s*):/g, '$1"$2"$3:');

  // Add double quotes around unquoted string values
  jsonLike = jsonLike.replace(/:\s*([a-zA-Z_][\w]*)/g, (match, p1) => {
    if (p1 === 'true' || p1 === 'false' || p1 === 'null') {
      return `: ${p1}`;
    }
    return `: "${p1}"`;
  });

  JSON.parse(jsonLike); // Validate the resulting string as JSON

  return jsonLike;
};
export default refactorToJSON;
