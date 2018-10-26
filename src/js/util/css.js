var parseUnit = function(value, unit, defaultUnit) {
  value = String(value || 0) + String(unit || "");
  var unitMatch = value.match(/[^0-9\.]+/g);
  defaultUnit = defaultUnit || "px";
  unit = unit || defaultUnit;
  if (unitMatch) unit = unitMatch[0];
  return {
    value: parseFloat(value) || 0,
    unit: unit
  };
};

var makeUnit = function(value, unit, defaultUnit) {
  defaultUnit = defaultUnit || "px";
  unit = unit || defaultUnit;
  switch (unit) {
    case "px":
      value = Math.round(value, 0);
      break;
  }
  return value+unit;
};
