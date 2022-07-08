// https://github.com/Code-Pop/vue-3-reactivity/blob/master/05-activeEffect.js

let activeEffect: any = null;
const targetMap = new WeakMap();

export const effect = (eff: () => void) => {
	// 只有在 effect 中, 才会触发 track
	activeEffect = eff;
	activeEffect();
	activeEffect = null;
};

export function track(target, key) {
	// We need to make sure this effect is being tracked.
	if (activeEffect) {
		let depsMap = targetMap.get(target);
		if (!depsMap) {
			// There is no map.
			targetMap.set(target, (depsMap = new Map())); // Create one
		}
		let dep = depsMap.get(key); // Get the current dependencies (effects) that need to be run when this is set
		if (!dep) {
			// There is no dependencies (effects)
			depsMap.set(key, (dep = new Set())); // Create a new Set
		}

		dep.add(activeEffect); // Add effect to dependency map
	}
}
export function trigger(target, key) {
	const depsMap = targetMap.get(target); // Does this object have any properties that have dependencies (effects)
	if (!depsMap) {
		return;
	}
	let dep = depsMap.get(key); // If there are dependencies (effects) associated with this
	if (dep) {
		dep.forEach(eff => {
			// run them all
			eff();
		});
	}
}
export const reactive = <T extends object>(target: T): T => {
	const handler = {
		// receiver 参数保证了当我们的对象有继承自其他对象的值或函数时,this指针能正确的指向使用
		get(target, key, receiver) {
			console.log('[ get ]', key);
			track(target, key);
			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			console.log('[ set ]', `key: ${String(key)}, value: ${value}`);
			let oldValue = target[key];
			// 注意 先 set 再 trigger
			const res = Reflect.set(target, key, value, receiver);
			if (oldValue !== value) {
				trigger(target, key);
			}
			return res;
		},
	};
	return new Proxy(target, handler);
};

/* const product = reactive({ price: 5, quantity: 2 });
let total = 0;
effect(() => {
	total = product.price * product.quantity;
});
console.log(total); // 10
product.quantity = 3;

// 此时get,就不会再触发 track
console.log('[  ]-80', product.quantity);

console.log(total); // 15 */

/* let product = reactive({ price: 5, quantity: 2 });
let salePrice = 0;
let total = 0;

effect(() => {
	total = product.price * product.quantity;
});
effect(() => {
	salePrice = product.price * 0.9;
});

console.log(
	`Before updated quantity total (should be 10) = ${total} salePrice (should be 4.5) = ${salePrice}`
);
product.quantity = 3;
console.log(
	`After updated quantity total (should be 15) = ${total} salePrice (should be 4.5) = ${salePrice}`
);
product.price = 10;
console.log(
	`After updated price total (should be 30) = ${total} salePrice (should be 9) = ${salePrice}`
); */
