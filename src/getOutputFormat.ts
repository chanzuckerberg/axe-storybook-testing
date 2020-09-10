/**
 * Normalize the output_format option.
 */
export default function getOutputFormat(outputFormatString: string): 'text' | 'json' {
  const normalizedOutputFormat = outputFormatString.toLowerCase();

  if (normalizedOutputFormat != 'text' && normalizedOutputFormat != 'json') {
    throw new Error(
      `Output format must be either 'text' or 'json'. Received: ${outputFormatString}`,
    );
  }

  return normalizedOutputFormat;
}
