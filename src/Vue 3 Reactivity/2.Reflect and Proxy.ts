/* let product = { price: 5, quantity: 2 };
let proxyProduct = new Proxy(product, {
	// receiver 参数保证了当我们的对象有继承自其他对象的值或函数时,this指针能正确的指向使用
	get(target, key, receiver) {
		console.log('[ get ]', key);
		return Reflect.get(target, key, receiver);
	},
	set(target, key, value, receiver) {
		console.log('[ set ]', `key: ${String(key)}, value: ${value}`);
		return Reflect.set(target, key, value, receiver);
	},
});

console.log('[  ]-9', proxyProduct.price);
proxyProduct.price = 10;
console.log('[  ]-9', proxyProduct.price); */

// https://github.com/Code-Pop/vue-3-reactivity/blob/master/03-targetMap.js
const reactive = target => {
	const targetMap = new WeakMap();
	function track(target, key) {
		// We need to make sure this effect is being tracked.
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
		dep.add(effect); // Add effect to dependency map
	}
	function trigger(target, key) {
		const depsMap = targetMap.get(target); // Does this object have any properties that have dependencies (effects)
		if (!depsMap) {
			return;
		}
		let dep = depsMap.get(key); // If there are dependencies (effects) associated with this
		if (dep) {
			dep.forEach(effect => {
				// run them all
				effect();
			});
		}
	}
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

const product = reactive({ price: 5, quantity: 2 });
let total = 0;
const effect = () => {
	total = product.price * product.quantity;
};
effect();
console.log(total); // 10
product.quantity = 3;

// 此时get,就会触发 track ,然后收集依赖等等..., 但是我们应该只在 effect 里调用追踪函数
// 引入 activeEffect 变量, vue也是这么做的
console.log('[  ]-80', product.quantity);

console.log(total); // 15

export {};
