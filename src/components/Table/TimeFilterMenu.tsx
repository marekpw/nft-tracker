import { useState } from 'react';
import { Menu, MenuItem, Button, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export interface TimeFilterMenuProps extends React.ComponentProps<typeof Box> {
  options: {
    rangeTime: number,
    label: string,
  }[];
  onTimeSelect: (rangeTime: number) => void;
  selectedTime: number;
}

export const TimeFilterMenu = (props: TimeFilterMenuProps) => {
  const { options, selectedTime, onTimeSelect, ...other } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (rangeTime: number) => {
    onTimeSelect(rangeTime);
    handleClose();
  };

  const selectedOption = options.find(option => option.rangeTime === selectedTime) ?? options[0];

  return (
    <Box {...other}>
      <Button
        variant="contained"
        disableElevation
        onClick={handleMenuButtonClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {selectedOption.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map(({ rangeTime, label }) => (
          <MenuItem key={rangeTime} onClick={() => handleMenuItemClick(rangeTime)} disableRipple>{label}</MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
