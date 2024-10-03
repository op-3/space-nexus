<script lang="ts">
    import { PLANET_DATA } from '$lib/utils/constants';
    
    let quizActive = false;
    let currentQuestion = 0;
    let score = 0;
    
    const questions = [
      {
        text: "Which planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
      },
      // ... المزيد من الأسئلة ...
    ];
  
    function startQuiz() {
      quizActive = true;
      currentQuestion = 0;
      score = 0;
    }
  
    function answerQuestion(answer: string) {
      if (answer === questions[currentQuestion].correctAnswer) {
        score++;
      }
      currentQuestion++;
      if (currentQuestion >= questions.length) {
        quizActive = false;
      }
    }
  </script>
  
  {#if !quizActive}
    <button on:click={startQuiz}>Start Solar System Quiz</button>
  {:else}
    <div class="quiz-panel">
      <h3>{questions[currentQuestion].text}</h3>
      {#each questions[currentQuestion].options as option}
        <button on:click={() => answerQuestion(option)}>{option}</button>
      {/each}
    </div>
  {/if}
  
  {#if !quizActive && currentQuestion > 0}
    <p>Quiz completed! Your score: {score}/{questions.length}</p>
  {/if}