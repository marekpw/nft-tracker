import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

export const StyledGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-root': {
    [theme.breakpoints.down('sm')]: {
      // on small devices grid is taking full width of the page and border + radius makes it look strange.
      border: 0,
      borderRadius: 0,
    }
  },
  '& .MuiDataGrid-columnHeader': {
    borderBottom: 'none',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeaders': {
    background: (theme.palette as any).neutral['100'],
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
    },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: 'none',
  },
  '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
    outline: "none !important",
  },
  '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
    outline: "none !important",
  },
}));