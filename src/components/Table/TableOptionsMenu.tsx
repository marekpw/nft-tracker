import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import debounce from 'lodash.debounce';

import { Box, IconButton, Popover, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, Slider  } from '@mui/material';
import DisplaySettingsIcon from '@mui/icons-material/Settings';

export type ChartDataset = 'avgPrice' | 'trades' | 'volume';
export interface TimeFilterMenuProps extends React.ComponentProps<typeof Box> {
  dataset: ChartDataset;
  minTrades: number;
  onDatasetChange: (dataset: ChartDataset) => void;
  onMinTradesChange: (minTrades: number) => void;
}

export const TableOptionsMenu = (props: TimeFilterMenuProps) => {
  const { dataset, minTrades, onDatasetChange, onMinTradesChange, ...other } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [minTradesIntermediate, setMinTradesIntermediate] = useState(props.minTrades);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedMinTradesChange = useCallback(debounce((minTrades: number) => {
    onMinTradesChange(minTrades);
  }, 500), [onMinTradesChange]);

  useEffect(() => {
    debouncedMinTradesChange(minTradesIntermediate);
  }, [debouncedMinTradesChange, minTradesIntermediate]);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDatasetChange = (event: ChangeEvent<HTMLInputElement>) => {
    onDatasetChange((event.target as HTMLInputElement).value as ChartDataset);
  };

  return (
    <Box {...other}>
      <IconButton
        onClick={handleMenuButtonClick}
      >
        <DisplaySettingsIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            padding: '24px',
            display: 'flex',
            flexFlow: 'column',
          }
        }}
      >
        <FormControl sx={{ mb: '16px', }}>
          <FormLabel>Chart Dataset</FormLabel>
          <RadioGroup value={dataset} onChange={handleDatasetChange} row>
            <FormControlLabel value="avgPrice" control={<Radio />} label="Average Price" />
            <FormControlLabel value="trades" control={<Radio />} label="Trades" />
            <FormControlLabel value="volume" control={<Radio />} label="Volume" />

          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Minimum Trades</FormLabel>
          <Slider
            min={3}
            max={100}
            value={minTradesIntermediate}
            marks={[{ value: 3, label: '3' }, { value: 100, label: '100' }]}
            onChange={(event, value) => setMinTradesIntermediate(value as number)}
            valueLabelDisplay='auto'
          />
        </FormControl>
      </Popover>
    </Box>
  );
};
