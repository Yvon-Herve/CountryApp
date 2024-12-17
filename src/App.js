import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import ChooseQuiz from "./pages/ChooseQuiz";
import ChooseDifficulty from "./pages/ChooseDifficulty";
import GuessCountryEasy from "./pages/Countries/GuessCountryEasy";
import GuessCountryMedium from "./pages/Countries/GuessCountryMedium";
import GuessCountryHard from "./pages/Countries/GuessCountryHard";
import GuessCapitalEasy from "./pages/Capital/GuessCapitalEasy";
import GuessCapitalMedium from "./pages/Capital/GuessCapitalMedium";
import GuessCapitalHard from "./pages/Capital/GuessCapitalHard";
import GuessMixedEasy from "./pages/Mixtes/GuessMixedEasy";
import GuessMixedMedium from "./pages/Mixtes/GuessMixedMedium";
import GuessMixedHard from "./pages/Mixtes/GuessMixedHard";
import Countries from "../src/pages/Countries";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/country/:name" element={<Details />} />
          <Route path="/choose-quiz" element={<ChooseQuiz />} />
          <Route path="/choose-difficulty" element={<ChooseDifficulty />} />

          {/* Routes pour GuessCountry */}
          <Route path="/guess-country/easy" element={<GuessCountryEasy />} />
          <Route
            path="/guess-country/medium"
            element={<GuessCountryMedium />}
          />
          <Route path="/guess-country/hard" element={<GuessCountryHard />} />

          {/* Routes pour GuessCapital */}
          <Route path="/guess-capital/easy" element={<GuessCapitalEasy />} />
          <Route
            path="/guess-capital/medium"
            element={<GuessCapitalMedium />}
          />
          <Route path="/guess-capital/hard" element={<GuessCapitalHard />} />

          {/* Routes pour GuessMixed */}
          <Route path="/guess-mixed/easy" element={<GuessMixedEasy />} />

          <Route path="/guess-mixed/medium" element={<GuessMixedMedium />} />

          <Route path="/guess-mixed/hard" element={<GuessMixedHard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
