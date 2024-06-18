import { makeStyles } from "@mui/styles";
import { createGlobalStyle } from "styled-components";

function useStyles() {
  const useStyles = makeStyles({
    root: {
      "& .MuiInputLabel-root": {
        fontFamily: "euclid",
        fontSize: 14,
        paddingTop: -2.5,
        fontWeight: "bold",
      },
      "& .MuiTableCell-root": {
        fontFamily: "euclid",
        fontSize: 14,
        paddingTop: -2.5,
        fontWeight: "bold",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        fontWeight: "bold",
        fontSize: 15,
      },
      "& .MuiInputBase-root": {
        border: "0 none",
        borderRadius: 7,
        height: 50,
        width: "100%",
        overflow: "hidden",
      },
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "gray",
      },
      "& .Muilplaceholder": {
        fontFamily: "euclid",
        fontSize: 10,
      },
      "& .MuiOutlinedInput-input": {
        fontFamily: "euclid-medium",
        fontSize: 14,
      },
      "& ::placeholder": {
        fontSize: 12,
      },
      display: "block",
      width: "100%",
    },
  });

  const GlobalStyles = createGlobalStyle`
  .MuiPaper-root{
    border-radius:10px;
  } 
  .MuiList-root {
    height: 215px;
  } 
  .MuiMenuItem-root {
      font-family: Euclid;
      font-size: 14px;
      font-weight: bold;
      margin: auto 8px;
      border-radius: 7px;
      margin-top:5px;
    }
    .MuiMenuItem-root:hover {
      background-color:#e0f2fe;
      padding-left: 15px;
    }
    .MuiMenuItem-root:hover {
      transition-duration: 0.2s;
    }
  
    ::-webkit-scrollbar {
      display: none;
      -ms-overflow-style: none;
      scrollbar-width: none;
      
  }
  `;
}

export default useStyles;
