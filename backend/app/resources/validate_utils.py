from ..models.user_info import USERINFO_ROLES


def validate_contact(contact, contact_str, error_list):
    if not isinstance(contact, dict):
        error_list.append(f"The {contact_str} supplied is not a dict.")
        return error_list
    contact_fields = ["name", "email", "phone"]
    for field in contact_fields:
        if field not in contact:
            error_list.append(
                f'The {contact_str} supplied does not have field "{field}".'
            )
        elif type(contact[field]) is not str:
            error_list.append(f'The field "{field}" in {contact_str} is not a string.')
        elif contact[field] == "":
            error_list.append(
                f'The field "{field}" in {contact_str} must not be an empty string.'
            )
    return error_list


def validate_userinfo(userinfo, error_list):
    userinfo_fields = [
        "email",
        "organization_address",
        "organization_name",
        "role",
        "primary_contact",
        "onsite_contacts",
    ]
    if not isinstance(userinfo, dict):
        error_list.append("The info supplied is not a dict.")
        return error_list

    for field in userinfo_fields:
        if field not in userinfo:
            error_list.append(f'The info supplied does not have field "{field}".')
    for key, val in userinfo.items():
        if key == "primary_contact":
            error_list = validate_contact(val, "info.primary_contact", error_list)
        elif key == "onsite_contacts":
            if not isinstance(val, list):
                error_list.append("The info.onsite_contacts supplied is not a list.")
            else:
                for i in range(len(val)):
                    error_list = validate_contact(
                        val[i], f"index {i} of info.onsite_contacts", error_list
                    )
        elif type(val) is not str:
            error_list.append(f"The field info.{key} supplied is not a string.")
        elif val == "":
            error_list.append(
                f"The field info.{key} supplied must not be an empty string."
            )
        elif key == "role" and val not in USERINFO_ROLES:
            error_list.append(
                "The status is not one of {valid_roles}".format(
                    valid_roles=", ".join(USERINFO_ROLES)
                )
            )

    return error_list
