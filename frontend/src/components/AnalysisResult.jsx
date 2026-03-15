function AnalysisResult({ result }) {
  if (!result) return null;

  return (
    <div>
      <h2>Emotion Analysis</h2>

      <p>
        <strong>Emotion:</strong> {result.emotion}
      </p>
      <p>
        <strong>Confidence:</strong> {result.confidence}
      </p>

      <h3>Insight</h3>
      <p>{result.insight}</p>

      <h3>Suggestion</h3>
      <p>{result.suggestion}</p>
    </div>
  );
}

export default AnalysisResult;
