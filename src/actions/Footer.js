import fetch from 'isomorphic-fetch'

export const CART_EDIT_COUNT = 'CART_EDIT_COUNT';

export function cartEditCount(count) {
    return {
        type: CART_EDIT_COUNT,
        count
    }
}