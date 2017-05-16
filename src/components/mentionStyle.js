export default ({
  input: {
    paddingTop: '.625rem',
    paddingRight: '1.875rem',
    paddingLeft: '3rem',
    paddingBottom: '.625rem',
    border: 0,
    outline: 'none',
  },
  suggestions: {

    list: {
      position:'absolute',
      bottom:0,
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 10,
    },

    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',

      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
});
