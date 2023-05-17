import {uiActions} from './ui-slice';
import { cartActions } from './cart-slice';

export const fetchCartData = () => {
  return async dispatch => {
    const fetchData = async () => {
      const response = await fetch('https://react-redux-87421-default-rtdb.firebaseio.com/cart.json');

      if(!response.ok){
        throw new Error('Could not fetch cart data!');
      }

      const responseData = response.json();

      return responseData;
    }; 

    try {
      const cartData =  await fetchData();
      dispatch(cartActions.replaceCart({
        items: cartData.items || [], //cartData.items인 항목 키를 갖는 객체인지 undefined의 빈 객체인지 확인
        totalQuantity: cartData.totalQuantity // 총 수량은 firebase에서 가져옴.
      }));
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status:'error',
          title:'Error',
          message: 'Fetching the data failed!',
        })
      )
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'Pending',
        title: 'Spending...',
        message: 'Spending the data',
      })
    );

    const sendRequest = async () => {
      const response = await fetch('https://react-redux-87421-default-rtdb.firebaseio.com/cart.json',{
        method: 'PUT',
        body: JSON.stringify({
          items: cart.items, 
          totalQuantity: cart.totalQuantity
        }),
      });

      if(!response.ok){
        throw new Error('Sending cart data failed.');
      }
    }

    try {
      await sendRequest();

      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data sucessfully!',
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status:'error',
          title:'Error',
          message: 'Spending the data failed!',
        })
      )
    }
  
  };
}
