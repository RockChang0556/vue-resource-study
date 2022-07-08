import { effect, reactive } from './3.activeEffect';
import { ref } from './4.ref';

export declare type ComputedGetter<T> = (...args: any[]) => T;
export declare interface ComputedRef<T = any> {
	readonly value: T;
}

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T> {
	const res = ref<T>();
	effect(() => (res.value = getter()));
	return res as ComputedRef<T>;
}

/* let product = reactive({ price: 5, quantity: 2 });

let salePrice = computed(() => {
	return product.price * 0.9;
});

let total = computed(() => {
	return salePrice.value * product.quantity;
});

console.log(
	`Before updated quantity total (should be 9) = ${total.value} salePrice (should be 4.5) = ${salePrice.value}`
);
product.quantity = 3;
console.log(
	`After updated quantity total (should be 13.5) = ${total.value} salePrice (should be 4.5) = ${salePrice.value}`
);
product.price = 10;
console.log(
	`After updated price total (should be 27) = ${total.value} salePrice (should be 9) = ${salePrice.value}`
); */

// 新增的属性也是响应式的
/* product.name = 'Shoes';
effect(() => {
	console.log(`Product name is now ${product.name}`);
});
product.name = 'Socks'; */
