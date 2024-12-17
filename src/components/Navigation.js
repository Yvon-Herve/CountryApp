import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="flex justify-right items-center text-white">
      <ul className="flex m-1 gap-6">
        <NavLink
          to="/countries"
          className={({ isActive }) =>
            `relative px-3 py-2 ${
              isActive ? "after:scale-x-100" : "after:scale-x-0"
            } after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gray-600 after:bottom-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`
          }
          end
        >
          <li>Accueil</li>
        </NavLink>

        <NavLink
          to="/choose-quiz"
          className={({ isActive }) =>
            `relative px-3 py-2 ${
              isActive ? "after:scale-x-100" : "after:scale-x-0"
            } after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gray-600 after:bottom-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`
          }
          end
        >
          <li>Quiz</li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Navigation;
