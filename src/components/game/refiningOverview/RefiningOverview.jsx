import React, { Fragment, useContext, useEffect, useState } from 'react';
import { GameDataContext } from '../dataProviders/GameDataProvider';
import { CharacterDataContext } from '../dataProviders/CharacterDataProvider';

import ExpBar from '../ExpBar';
import Container from '@mui/material/Container';
import CarpenterIcon from '@mui/icons-material/Carpenter';

import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel'
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import { ClickAwayListener } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ResourceIcon from '../gameComponents/icons/ResourceIcon';
import RecipeIcon from '../gameComponents/icons/RecipeIcon';

import ClickAwayPopper from '../../common/ClickAwayPopper'
import ProfessionSelector from './ProfessionSelector';
import RecipeSelector from './RecipeSelector';
import RecipeInfo from './RecipeInfo';
import IngredientSelector from './IngredientSelector';
import StartActionController from './StartActionController';

const RefiningOverview = () => {
  const { gameData, send } = useContext(GameDataContext);
  const { characterData } = useContext(CharacterDataContext);

  const refiningRecipes = gameData.refiningRecipes

  const [profession, setProfession] = useState('');
  const [allRecipes, setAllRecipes] = useState({});
  const [recipeName, setRecipe] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleProfession = (newProfession) => {
    console.log('selected Profession', newProfession)
    // Reset recipe and ingredients when the profession changes
    setProfession(newProfession);
    setRecipe('');
    setIngredients([]);
    setSelectedIngredients([]);
    setAllRecipes(refiningRecipes[newProfession]);
  };

  const handleRecipe = (newRecipeName) => {
    console.log("selected Recipe: ", newRecipeName)
    setRecipe(newRecipeName);
    setIngredients(allRecipes[newRecipeName]?.ingredients || []);
    const newSelectedIngredients = allRecipes[newRecipeName]?.ingredients.map((value) => value.required ? value.slot[0].resource : "") || []
    setSelectedIngredients(newSelectedIngredients);
    console.log("selected Ingredients: ", newSelectedIngredients)
  };

  const handleIngredients = (ingredientName, slotIndex) => {
    const newSelectedIngredients = [...selectedIngredients];
    newSelectedIngredients[slotIndex] = ingredientName
    console.log("selected Ingredients: ", newSelectedIngredients);
    setSelectedIngredients(newSelectedIngredients);
  };

  function init(){
    const selectedProfession = 'woodworking'

    setProfession(selectedProfession)
    setRecipe('');
    setIngredients([]);
    setSelectedIngredients([]);
    setAllRecipes(refiningRecipes[selectedProfession]);
  } 
  
  useEffect(() => {
    init();
  }, []);

  const [limit, setLimit] = React.useState(true);

  const handleLimit = (event) => {
    setLimit(event.target.checked);
    setIterations(1);
  };

  const [iterations, setIterations] = useState(1);
  const handleIterations = (number) => {
    setIterations(number)
  }
  
  function handleStart(){
    const crafting = {
      "type": "action",
      "actionType": profession,
      "task": "crafting",
      "limit": limit,
      "iterations": parseInt(iterations),
      "args": {
          "recipe": recipeName,
          "ingredients": selectedIngredients.filter((value) => value !== "")
      }
    }
    console.log("crafting: ", crafting);
    send(crafting)
  }

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex"
        flexDirection='column'
        alignItems="center"
        sx={{ bgcolor: 'rgba(169, 223, 251, 0.8)'}}>
        <ProfessionSelector 
          professions={['woodworking', 'smelting', 'weaving']}
          selectedProfession={profession}
          onChange={handleProfession} 
        />
        <RecipeSelector
          selectedRecipeName={recipeName}
          recipeMap={allRecipes}
          onChange={handleRecipe}
        />
        {recipeName && <RecipeInfo recipe={allRecipes[recipeName]}/>}
        <IngredientSelector
          selectedIngredients={selectedIngredients}
          ingredients={ingredients}
          onChange={handleIngredients}
        />
      
        <StartActionController
          hasLimit={limit}
          onChangeLimit={handleLimit}
          iterations={iterations}
          onChangeIterations={handleIterations}
          startDisabled={selectedIngredients.filter((value) => value !== "").length < 1}
          onClickStart={handleStart}
        />
      </Box>
    </Container>
  );
};

export default RefiningOverview;
