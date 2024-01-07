import React, { useContext, useEffect, useState } from 'react';
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
import ResourceIcon from '../inventory/ResourceIcon';
import RecipeIcon from '../refiningOverview/RecipeIcon';

const AugmentationOverview = () => {
  const { gameData, send } = useContext(GameDataContext);
  const { characterData } = useContext(CharacterDataContext);

  const [profession, setProfession] = useState('');
  const [allRecipes, setAllRecipes] = useState({});
  const [recipeName, setRecipe] = useState('');
  const [upgrades, setUpgrades] = useState([]);
  const [selectedUpgrades, setSelectedUpgrades] = useState([]);

  const handleProfession = (event) => {
    const newProfession = event.target.value;

    // Reset recipe and ingredients when the profession changes
    setProfession(newProfession);
    setRecipe('');
    setUpgrades([]);
    setSelectedUpgrades([]);
    setAllRecipes(Object.fromEntries(
      Object.entries(gameData.recipesData[newProfession]).filter(([key, value]) => value.upgrades.length > 0)
    ))
  };

  const handleRecipe = (eventOrRecipeName) => {
    let newRecipe
    // Check if it's an event (coming from the Select component)
    if (eventOrRecipeName instanceof Event) {
      newRecipe = eventOrRecipeName.target.value;
      setRecipe(newRecipe);
    } else {
      // It's a recipe name (coming from the ResourceIcon)
      newRecipe = eventOrRecipeName
      setRecipe(eventOrRecipeName);
    }

    setUpgrades(allRecipes[newRecipe]?.upgrades || []);
    setSelectedUpgrades(allRecipes[newRecipe]?.upgrades.map((value) => value.required ? value.slot[0].resource : "") || [] );
    handleClose()
  };

  const handleUpgrades = (event, index) => {
    const newSelectedUpgrades = [...selectedUpgrades];
    newSelectedUpgrades[index] = event.target.value;
    console.log("selected Upgrades: ", newSelectedUpgrades);
    setSelectedUpgrades(newSelectedUpgrades);
  };

  function init(){
    const selectedProfession = 'toolsmith'

    setProfession(selectedProfession)
    setRecipe('');
    setUpgrades([]);
    setSelectedUpgrades([]);
    setAllRecipes(Object.fromEntries(
      Object.entries(gameData.recipesData[selectedProfession]).filter(([key, value]) => value.upgrades.length > 0)
    ))
  } 
  
  useEffect(() => {
    init();
  }, []);

  const [limit, setLimit] = React.useState(true);

  const handleLimit = (event) => {
    setLimit(event.target.checked);
    if (event.target.checked) {
      setIterations(1);
    } else {
      setIterations(1);
    }
  };

  const [iterations, setIterations] = useState(1);
  const handleIterations = (event) => {
    setIterations(parseInt(event.target.value))
  }
  
  function handleStart(){
    const upgrading = {
      "type": "action",
      "actionType": profession,
      "task": "upgrading",
      "limit": limit,
      "iterations": parseInt(iterations),
      "args": {
          "recipe": recipeName,
          "upgrades": selectedUpgrades.filter((value) => value !== "")
      }
    }
    console.log("crafting: ", upgrading);
    send(upgrading)
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;



  return (
    <Container maxWidth="sm">
      <Box 
        display="flex"
        flexDirection='column'
        alignItems="center"
        sx={{ bgcolor: 'rgba(169, 223, 251, 0.8)'}}>
      <Container maxWidth="xs">
        <Box 
          display="flex"
          flexDirection='column'
          alignItems="center"
          sx={{ bgcolor: 'rgba(198, 221, 233, 0.8)'}}>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="profession-label">Profession</InputLabel>
          <Select
            labelId="profession-label"
            id="profession"
            value={profession}
            label="Profession"
            onChange={handleProfession}
          >
            <MenuItem value={'toolsmith'}>Toolsmith</MenuItem>
            <MenuItem value={'armorer'}>Armorer</MenuItem>
          </Select>
        </FormControl>
        </Box>
      </Container>

      <Container maxWidth="xs">
        <Box 
          display="flex"
          flexDirection='column'
          alignItems="center"
          sx={{ bgcolor: 'rgba(160, 177, 186, 0.8)'}}
        >
          <div>Select a Recipe:</div>
          
          {<Box
            sx={{
          border: '2px dashed #000', // Adjust the border styles
          padding: 0.3, // Optional: Add padding to the box
          display: 'inline-block', // Make sure the box is inline with the content
          }}
          >
          {recipeName ? (
            <RecipeIcon recipe={allRecipes[recipeName]} profession={profession} recipeName={recipeName} onClick={handleClick} />
            ) : (
              <RecipeIcon disableTitle onClick={handleClick} />
            )}
          </Box>
          }
          {open && <ClickAwayListener onClickAway={handleClose}>
            <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            placement='bottom'
          >
          <Container maxWidth="xs">
            <Box
              sx={{ bgcolor: 'rgba(160, 177, 186, 0.8)'}}
            >
            <Grid container spacing={1}>
              {Object.keys(allRecipes).map((recipeName) => (
                  <Grid item key={recipeName}>
                    <RecipeIcon recipe={allRecipes[recipeName]} profession={profession} recipeName={recipeName} onClick={() => handleRecipe(recipeName)}/>
                  </Grid>
                ))}
            </Grid>
            </Box>
          </Container>
        </Popper>
        </ClickAwayListener>}
      </Box>
      </Container>

      {recipeName && (
      <Container maxWidth="xs">
        <Box 
          display="flex"
          flexDirection='column'
          alignItems="center"
          sx={{ bgcolor: 'rgba(135, 168, 155, 0.8)'}}
        >
          <h3>Info:</h3>
          <b>{`Amount: ${allRecipes[recipeName].amount} x ${recipeName}`}</b>
          <b>{`Level: ${allRecipes[recipeName].level}`}</b>
          <b>{`Exp: ${allRecipes[recipeName].exp}`}</b>
          <b>{`CharExp: ${allRecipes[recipeName].expChar}`}</b>
          <b>{`Time: ${allRecipes[recipeName].time}ms`}</b>
        </Box>
      </Container>)}

      <Container maxWidth="xs">
        <Box 
          display="flex"
          flexDirection='column'
          alignItems="center"
          sx={{ bgcolor: 'rgba(135, 168, 185, 0.8)'}}
        >
          
          <Box 
          display="flex"
          flexDirection='row'
          alignItems="center"
          sx={{ bgcolor: 'rgba(135, 168, 185, 0.8)'}}
        >
          {upgrades.map((value, index) => (
            
          <FormControl key={index} sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="ingredient-label">Augment</InputLabel>
            <Select
              labelId="ingredient-label"
              id="ingredient"
              value={selectedUpgrades[index] || (value.required ? value.slot[0].resource : "")}
              label="Augment"
              onChange={(event) => handleUpgrades(event, index)}
            >
              {!value.required && 
              (<MenuItem key={"empty"} value={""}>
                empty
              </MenuItem>)
              }
              {value.slot.map((value, index) => (
                <MenuItem key={index} value={value.resource}>
                  {value.amount}   {value.resource}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          ))}
          </Box>
        </Box>
      </Container>
      <Container maxWidth="xs">
        <Box 
            display="flex"
            flexDirection='column'
            alignItems="center"
            sx={{ bgcolor: 'rgba(91, 91, 91, 0.8)'}}
          >
            <FormControlLabel control={<Switch checked={limit} onChange={handleLimit}/>} label="Limit" />
          
          {limit && (<TextField
            label="Iterations"
            id="outlined-size-small"
            defaultValue= {iterations}
            size="small"
            onChange={handleIterations}
          />)}
          <Button disabled={selectedUpgrades.filter((value) => value !== "").length < 1} onClick={handleStart} variant="contained">Start</Button>
        </Box>
      </Container>
      </Box>
    </Container>
  );
};

export default AugmentationOverview;
