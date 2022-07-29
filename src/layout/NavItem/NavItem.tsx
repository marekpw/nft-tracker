
import { Box, Button, ListItem } from '@mui/material';
import { Link, useResolvedPath, useMatch } from "react-router-dom";

export interface NavItemProps extends React.ComponentProps<typeof ListItem> {
  to: string;
  title: string;
  icon?: React.ReactNode;
}

export const NavItem = (props: NavItemProps) => {
  const { to, title, icon, ...others } = props;
  const resolved = useResolvedPath(to);
  const active = useMatch({ path: resolved.pathname, end: true });

  return (
    <ListItem
      disableGutters
      {...others}
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2,
        ...others.sx,
      }}
    >
      <Button
        component={Link}
        to={to}
        disableRipple
        startIcon={icon}
        sx={{
          backgroundColor: active && 'rgba(255,255,255, 0.08)',
          borderRadius: 1,
          color: active ? 'secondary.main' : 'neutral.300',
          fontWeight: active && 'fontWeightBold',
          justifyContent: 'flex-start',
          px: 3,
          textAlign: 'left',
          textTransform: 'none',
          width: '100%',
          '& .MuiButton-startIcon': {
            color: active ? 'secondary.main' : 'neutral.400'
          },
          '&:hover': {
            backgroundColor: 'rgba(255,255,255, 0.08)'
          }
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {title}
        </Box>
      </Button>
    </ListItem>
  );
};