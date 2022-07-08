import { track, trigger, effect, reactive } from './3.activeEffect';

/* ref 是怎么实现的 */

/* 
  直接使用 reactive 包裹
*/
/* function ref1<T extends object>(raw: T) {
	return reactive({ value: raw });
}
const product = ref1({ price: 5, quantity: 2 });
console.log('[ product ]-12', product);
 */
/* 
  使用 track, trigger 实现
*/
export function ref<T>(raw?: T): { value: T | undefined } {
	const r = {
		get value() {
			track(r, 'value');
			return raw;
		},
		set value(newVal) {
			if (newVal !== raw) {
				raw = newVal;
				trigger(r, 'value');
			}
		},
	};
	return r;
}
// const product = ref(0);
// console.log('[ product ]-12', product);

/* let product = reactive({ price: 5, quantity: 2 });
let salePrice = ref(0);
let total = 0;

effect(() => {
	total = salePrice.value * product.quantity;
});
effect(() => {
	salePrice.value = product.price * 0.9;
});

console.log(
	`Before updated quantity total (should be 9) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
);
product.quantity = 3;
console.log(
	`After updated quantity total (should be 13.5) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
);
product.price = 10;
console.log(
	`After updated price total (should be 27) = ${total} salePrice (should be 9) = ${salePrice.value}`
);
 */
