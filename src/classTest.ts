interface StaticProperties {
  id: number;
  wow: string;
}

class Wow implements StaticProperties {
  id: number;
  wow: string;
  constructor(obj: StaticProperties) {
    Object.assign(this, obj)
  }

  isWow() {
    return (this.wow == "wow")
  }
}

let wow1 = new Wow({
  id: 1,
  wow: "wow"
})

print(wow1)
print(wow1.isWow())

let wow2 = new Wow({
  id: 2,
  wow: "woow"
})

print(wow2)
print(wow2.isWow())