import '../styles/QuestionCard.css'

const QuestionCard = ({ question, selectedAnswer, onAnswerSelect }) => {
  return (
    <div className="question-card">
      <div className="question-content">
        <h2 className="question-text">{question.question}</h2>
        
        <div className="options-container">
          {question.options.map((option) => (
            <button
              key={option.value}
              className={`option-button ${
                selectedAnswer === option.value ? 'selected' : ''
              }`}
              onClick={() => onAnswerSelect(option.value)}
            >
              <span className="option-radio">
                {selectedAnswer === option.value && '✓'}
              </span>
              <span className="option-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuestionCard