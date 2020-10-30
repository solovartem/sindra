export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const REDUX_KEY = {
	AUTH: 'AUTH',
	TABLE_INVESTMENT: {
		TABLE: "TABLE_INVESTMENT_TABLE"
	},
	TABLE_INSURANCE: {
		TABLE: "TABLE_INSURANCE_TABLE"
	},
	ESTIMATION: 'ESTIMATION',
	BASIC_DETAILS: 'BASIC_DETAILS',
	RECOMMENDED_STRATEGIES: 'RECOMMENDED_STRATEGIES',
};

// policy ownership
export const policyOwnershipLife = [
	{
		value: 'super',
		text: 'Super'
	},
	{
		value: 'nonSuper',
		text: 'Non-Super'
	}
];

export const policyOwnershipTPD = [
	{
		value: 'linkedToLife',
		text: 'Linked To Life'
	},
	{
		value: 'super',
		text: 'Super'
	},
	{
		value: 'nonSuper',
		text: 'Non-Super'
	},
	{
		value: 'superLink',
		text: 'Super-Link'
	}
];

export const policyOwnershipTrauma = [
  {
    value: 'linkedToLife',
    text: 'Linked To Life'
  },
  {
    value: 'standAlone',
    text: 'Stand-alone'
  }
];

export const policyOwnershipIP = [
  {
    value: 'super',
    text: 'Super'
  },
  {
    value: 'nonSuper',
    text: 'Non-Super'
  },
  {
    value: 'superLink',
    text: 'Super-Link'
  }
];

// features
export const featuresTPD = [
  {
    value: 'own',
    text: 'Own'
  },
  {
    value: 'any',
    text: 'Any'
  },
  {
    value: 'homeMaker',
    text: 'Home Maker'
  }
];

export const featuresTrauma = [
  {
    value: 'premier',
    text: 'Premier'
  },
  {
    value: 'reinstatement',
    text: 'Reinstatement'
  }
];

export const featuresIP = [
	{
		value: 'compPremier',
		text: 'Comp/Premier'
	},
	{
		value: 'cpi',
		text: 'CPI'
	}
];

// premium type
export const premiumType = [
	{
		value: 'level',
		text: 'Level'
	},
	{
		value: 'stepped',
		text: 'Stepped'
	}
];

// premium frequency
export const premiumFrequency = [
	{
		value: 'monthly',
		text: 'Monthly'
	},
	{
		value: 'yearly',
		text: 'Yearly'
	}
];

// commission structure
export const commissionStructure = [
	{
		value: 'upfront',
		text: 'Upfront'
	},
	{
		value: 'level',
		text: 'Level'
	},
	{
		value: 'hybrid',
		text: 'Hybrid'
	}
];

// insurance quotes
export const insuranceQuotes = [
  {
    value: 'yes',
    text: 'Yes'
  },
  {
    value: 'no',
    text: 'No'
  }
];