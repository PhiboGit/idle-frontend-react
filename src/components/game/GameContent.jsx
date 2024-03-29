import React, { useEffect, useState } from 'react';
import {connectWebSocket, disconnectWebSocket, sendWebsocket} from './WebSocketService';
import { GameDataProvider } from './dataProviders/GameDataProvider';
import { CharacterDataProvider } from './dataProviders/CharacterDataProvider';

import { Grid, Container, Box, Tabs, Tab } from '@mui/material';

import ActionOverview from './actionOverview/ActionOverview';
import BasicTabs from './mainContent/BasicTabs';
import InventoryOverview from './inventory/InventoryOverview';
import InventoryTabs from './inventory/InventoryTabs';

const messageReceiver = new EventTarget()

export default function GameContent() {

  return (
      // if too small and uses xs the grid is scrollable to reach second item
      <Grid container style={{height: '100%', overflow: 'auto'}}>
        {/* row with sm, else column with xs when too small ,scrollable item */}
        <Grid item xs={12} sm={8} style={{height: '100%', overflow: 'auto'}}>
            <BasicTabs />
        </Grid>
        {/* row with sm, else column with xs when too small ,scrollable item */}
        <Grid item xs={12} sm={4} style={{height: '100%', overflow: 'auto'}}>     
          <InventoryTabs />
        </Grid>
      </Grid>
    
  );
}
