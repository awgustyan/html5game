export default class Instance {
    constructor(parent, children) {
        this.Children = children || [];
        this.Parent = parent || null;

        if (parent) {
            parent.AddChild(this)
        }
    }

    get GetChildren () {
        return this.Children;
    }

    AddChild (child) {
        this.Children.push(child);
    }

    FindFirstClass (className) {
        let foundChild = null;

        for (let index = 0; index < this.Children.length; index++) {
            const element = this.Children[index];
            
            if (element.constructor.name == className) {
                foundChild = element;
                break;
            }
        }

        return foundChild;
    }
}