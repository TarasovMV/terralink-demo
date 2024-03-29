export enum SupabaseErrors {
    SignupError = 'SIGNUP_ERROR',
    UserAlreadyRegistered = 'USER_ALREADY_REGISTERED',
    NetworkError = 'NETWORK_ERROR',

    QrNotFound = 'QR_NOT_FOUND',
    GetStandsMetaError = 'GET_STANDS_META_ERROR',
    GetCurrentUserError = 'GET_CURRENT_USER_ERROR',
    GetQrsError = 'GET_QRS_ERROR',
    GetPresentationError = 'GET_PRESENTATION_ERROR',
    GetProductError = 'GET_PRODUCT_ERROR',
    GetProductGroupsError = 'GET_PRODUCT_GROUPS_ERROR',

    SetStandDoneError = 'SET_STAND_DONE_ERROR',
}
