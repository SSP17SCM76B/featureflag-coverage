export class StratusAuthApplication {
    public applicationId = 0;
    public code = '';
    public name = '';
    public platform = '';
    public ownerGroupId = 0;
    public roles?: StratusAuthRole[] = [];
    public createdOn ?= new Date();
    public changedOn ?= new Date();

    // non server properties
    public isNew ?: boolean;
}

export class StratusAuthConstant {
    public constantId = 0;
    public typeOf = '';
    public value = '';
    public createdOn = new Date();
    public changedOn = new Date();
}

export class StratusAuthGroup {
    public groupId = 0;
    public name ?= '';
    public displayName ?= '';
    public isExternal ?= false;
    public objectId ?= '';
    public tenantId ?= '';
    public createdOn ?= new Date();
    public changedOn ?= new Date();
    public roles?: StratusAuthRole[] = null;
    public users?: StratusAuthUser[] = null;

    // non server properties
    public isSelected ?: boolean;
    public roleId ?: number;
}

export class StratusAuthRole {
    public roleId = 0;
    public applicationId ?= 0;
    public applicationCode ?= '';
    public name = '';
    public description = '';
    public isExternal = false;
    public isWriteRole = false;
    public createdOn ?= new Date();
    public changedOn ?= new Date();
    public groups?: StratusAuthGroup[] = [];

    // non server properties
    public isNew ?: boolean;
}

export class StratusAuthUser {
    public userId = 0;
    public displayName = '';
    public emailAddress = '';
    public alias = '';
    public userPrincipalName ?= '';
    public company = '';
    public isExternal = true;
    public objectId ?= '';
    public tenantId ?= '';
    public groups?: StratusAuthGroup[] = [];
    public createdOn ?= new Date();
    public changedOn ?= new Date();
    public lastLoginOn ?= new Date();
}

// tslint:disable-next-line:max-classes-per-file
export class StratusAuthRoleGroup {
    public applicationId = 0;
    public roleId = 0;
    public groupId = 0;
    public createdOn = new Date();
    public changedOn = new Date();
}

// tslint:disable-next-line:max-classes-per-file
export class StratusAuthUserGroup {
    public userId = 0;
    public groupId = 0;
    public createdOn = new Date();
    public changedOn = new Date();
}

// tslint:disable-next-line:max-classes-per-file
export class StratusAuthInvitation {
    public invitedUserDisplayName = '';
    public invitedUserEmailAddress = '';
    public inviteRedirectUrl = '';
    public sendInvitationMessage = true;
}

// tslint:disable-next-line:max-classes-per-file
export class StratusAuthNewInvitation {
    public company = '';
    public invitation = new StratusAuthInvitation();
}
